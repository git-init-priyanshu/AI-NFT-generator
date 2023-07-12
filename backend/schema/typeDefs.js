const typeDefs = `#graphql
    #Stable Diffusion
    type stableDiffusionOutput{
        status: Status
        generationTime: Float!
        id: ID
        output: [String]!
        meta: Meta
    }
    type fetchedOutput{
        status: Status
        id: ID
        output: [String]!
    }
    type error{
        status: Status
        message: String!
    }
 
    type Meta{
        H: Int,
        W: Int,
        enable_attention_slicing: Boolean
        file_prefix: String
        guidance_scale: Float
        model: String
        n_samples: Int,
        negative_prompt: String,
        outdir: String,
        prompt: String,
        revision: String,
        safetychecker: Safetychecker,
        seed: Int,
        steps: Int,
        vae: String
    }
    enum Status{
        success
        processing
        error
    }
    enum Safetychecker{
        yes
        no
    }

    #Upload to Pinata
    type uploadToPinataOutput{
        token_URI: String!
    }

    union Output = stableDiffusionOutput | fetchedOutput | error

    type Query{
        getImage(key: String!,prompt: String!): Output
        uploadToPinata(url: String!): uploadToPinataOutput!
    }
`;

module.exports = { typeDefs };
