import { type RepositoryService } from "@vibefire/services/fauna";

import { ReposManager } from "!managers/repos-manager";

export class UFGroupsManger {
  constructor(private readonly repos: ReposManager) {}

  static fromService(repoService: RepositoryService) {
    return new UFGroupsManger(ReposManager.fromService(repoService));
  }

  //   async createGroup(p: {
  //     userAid: string;
  //     name
}
