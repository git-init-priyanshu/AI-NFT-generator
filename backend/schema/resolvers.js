const axios = require("axios");
const axiosRetry = require("axios-retry");
const FormData = require("form-data");
require("dotenv").config();

const fetchingQueuedImage = async (key, request_id) => {
  return new Promise(async (resolve, reject) => {
    var raw = JSON.stringify({
      key: key,
      request_id: request_id,
    });

    var requestOptions = {
      method: "POST",
      url: "https://stablediffusionapi.com/api/v4/dreambooth/fetch",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
    };

    try {
      const res = await axios(requestOptions);
      console.log(res.data);
      if (res.data.status === "success") {
        resolve(res.data); // Resolve the promise with the desired value
      } else if (res.data.status === "processing") {
        // Calling the function until the processing is done
        setTimeout(async () => {
          await fetchingQueuedImage(key, request_id);
        }, 5000);
      }
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
};

const uploadImage = (sourceUrl) => {
  return new Promise(async (resolve, reject) => {
    const axiosInstance = axios.create();
    axiosRetry(axiosInstance, { retries: 5 });

    const data = new FormData();

    try {
      const response = await axiosInstance(sourceUrl, {
        method: "GET",
        responseType: "stream",
      });
      data.append(`file`, response.data);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            Authorization: `Bearer ${process.env.JWT}`,
          },
        }
      );
      resolve(res.data); // Resolve the promise with the desired value
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
};

const uploadMetadata = async (url) => {
  return new Promise(async (resolve, reject) => {
    var metaData = JSON.stringify({
      name: "My NFT",
      description: "Description of my NFT",
      image: `${url}`,
    });
    try {
      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT}`,
        },
        data: metaData,
      };

      const res = await axios(config);

      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

const resolvers = {
  Output: {
    __resolveType: (obj) => {
      if (obj.status === "success") {
        return "successOutput";
      }
      if (obj.status === "processing") {
        return "processingOutput";
      }
      if (obj.status === "error") {
        return "error";
      }
      return null;
    },
  },

  Query: {
    // StableDiffusion Resolver
    getImage: async (parent, args) => {
      try {
        let options = {
          method: "POST",
          url: "https://stablediffusionapi.com/api/v3/text2img",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            key: args.key,
            prompt: args.prompt,
            negative_prompt: null,
            width: "512",
            height: "512",
            samples: "1",
            num_inference_steps: "20",
            seed: null,
            guidance_scale: 7.5,
            safety_checker: "no",
            multi_lingual: "no",
            panorama: "no",
            self_attention: "no",
            upscale: "no",
            embeddings_model: "embeddings_model_id",
            webhook: null,
            track_id: null,
          },
        };

        const response = await axios(options);
        console.log(response.data);

        if (response.data.status === "success") {
          return response.data;
        } else if (response.data.status === "processing") {
          // const res = await fetchingQueuedImage(
          //   args.key,
          //   response.data.request_id
          // );
          const res = {
            status: "processing",
            message: "API call is taking too long to respond",
          };
          return res;
        } else {
          return response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Upload to Pinata resolver
    uploadToPinata: async (parent, args) => {
      const response = await uploadImage(args.url);

      // Getting hash of latest upload
      const hash = response.IpfsHash;
      const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
      // Uploading metadata
      const data = await uploadMetadata(url);
      // Getting final hash of the metadata
      const metadata_hash = data.IpfsHash;

      return {
        token_URI: `https://gateway.pinata.cloud/ipfs/${metadata_hash}`,
      };
    },
  },
};

module.exports = { resolvers };
