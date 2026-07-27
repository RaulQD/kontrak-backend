interface IpasswordHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hash: string): Promise<string>;
}
