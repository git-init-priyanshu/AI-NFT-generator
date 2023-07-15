import { gql } from "@apollo/client";

const GET_IMAGE_QUERY = gql`
  query GetImage($key: String!, $prompt: String!) {
    getImage(key: $key, prompt: $prompt) {
      ... on successOutput {
        status
        output
      }
      ... on processingOutput {
        status
        message
      }
      ... on error {
        status
        message
      }
    }
  }
`;

export default GET_IMAGE_QUERY;
