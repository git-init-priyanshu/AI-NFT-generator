import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Toaster, toast } from "react-hot-toast";
import { Box, Button, TextField } from "@mui/material";

import GET_IMAGE_QUERY from "../Queries/getImage";
import Image from "./Image";
import SaveNFT from "./SaveNFT";

export default function InputPrompt() {
  const [imgState, setImgState] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string>("");

  const [getData, { data: imgData }] = useLazyQuery(GET_IMAGE_QUERY);

  const getImage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const APIkey =
      "eDQEK5xVfrT2FdUl8HEwVS6X2MuhB3VASGzsgbnPlmNM6wvb5aJK7WwZxxet";

    toast
      .promise(
        getData({
          variables: {
            key: APIkey,
            prompt: prompt,
          },
        }),
        {
          loading: "Generating Image...",
          success: (res) => {
            setImgState(res.data.getImage.output[0]);
            return "success";
          },
          error: "Some Error occured",
          /**
           * have to write code to handel error in backend
           * So that react toast displays the information correctly
           */
        }
      )
      .catch((err) => console.log(err));
  };

  return (
    <Box
      sx={{ display: "flex", maxWidth: "60%" }}
      className=" flex w-full sm: flex-col lg:flex-row"
    >
      <Box>
        <Toaster position="bottom-right" reverseOrder={false} />
      </Box>
      <Box
        sx={{
          marginBottom: "1rem",
          width: "100%",
          marginY: "1rem",
        }}
        className="h-calc"
      >
        {imgData && imgData.getImage.status === "success" ? (
          <Image image={imgState} />
        ) : (
          <Image image={null} />
        )}

        <Box
          component="form"
          onSubmit={getImage}
          sx={{ display: "flex", gap: "1rem" }}
          // className=" h-16 mt-2 w-full flex items-start"
        >
          <TextField
            id="prompt"
            required
            fullWidth
            variant="filled"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrompt(e.target.value)
            }
            label="Enter your prompt"
            sx={{ height: "1rem" }}
          />
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Button variant="contained" type="submit">
              Generate
            </Button>
            <SaveNFT image={imgState} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
