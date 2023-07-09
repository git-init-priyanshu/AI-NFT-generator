const typeDefs = `#graphql
    #Stable Diffusion
    type stableDiffusionOutput{
        status: Status
        generationTime: Float!
        id: ID
        output: [String!]!
        meta: Meta
    }
    type URL{
        url: String
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
    }
    enum Safetychecker{
        yes
        no
    }

    #Upload to Pinata
    type uploadToPinataOutput{
        token_URI: String!
    }

    type Query{
        getImage(key: String!,prompt: String!): stableDiffusionOutput
        uploadToPinata(url: String!): uploadToPinataOutput!
    }
`;

module.exports = { typeDefs };
