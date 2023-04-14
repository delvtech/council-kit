export interface LeafWithProof {
  leaf: {
    address: string;
    amount: string;
  };
  proof: string[];
}
