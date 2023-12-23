import { Box, Paper } from "@mui/material";
import img from "../assets/image_icon.png";

export default function Image(props: { image: string }) {
  return (
    <Paper
      elevation={5}
      sx={{
        width: "100%",
        height: "100%",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      className=" bg-neutral-600"
    >
      <Box className="image" sx={{ height: "100%", width: "80%" }}>
        <img src={props.image} alt="" className="" />
      </Box>
    </Paper>
  );
}
