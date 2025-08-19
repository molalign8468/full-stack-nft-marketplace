import os
import json


image_cid = "bafybeic7b56254f6m6tk3ovlg7u3atxkgrbc7dsvpz5af2jnqnihkxhe5e"
output_dir = "metadata"             
total_nfts = 62           



os.makedirs(output_dir, exist_ok=True)

for i in range(total_nfts):
    metadata = {
        "name": f"LoyaltyPoint #{i}",
        "description": "A unique NFT from the LoyaltyPoint collection.",
        "image": f"ipfs://{image_cid}/{i}.jpg",
        "attributes": [
            {"trait_type": "Collection", "value": "LoyaltyPoint"},
            {"trait_type": "Edition", "value": i}
        ]
    }
    
    file_path = os.path.join(output_dir, f"{i}.json")
    with open(file_path, "w") as f:
        json.dump(metadata, f, indent=4)

print(f"✅ Created {total_nfts} metadata files in '{output_dir}'")
