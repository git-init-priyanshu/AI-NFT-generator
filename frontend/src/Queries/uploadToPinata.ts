import { gql } from "@apollo/client";

const UPLOAD_TO_PINATA_QUERY = gql`
  query UploadToPinata($url: String!) {
    uploadToPinata(url: $url) {
      token_URI
    }
  }
`;

export default UPLOAD_TO_PINATA_QUERY;
