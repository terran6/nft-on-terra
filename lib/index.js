module.exports = ({ wallets, refs, config, client }) => 
  (
    {
      mint: (token_id, owner_address, nft_name, image_url, signer = wallets.validator) =>
        client.execute(
          signer,
          "cw721-metadata-onchain", 
          { mint: {
              owner: owner_address,
              token_id: token_id,
              extension: {
                name: nft_name,
                image: image_url,
              },
            }
          }
        ),
      query: (token_id) =>
          client.query(
            "cw721-metadata-onchain",
            {"nft_info": {"token_id": token_id.toString()}}
          )
    }
  );
