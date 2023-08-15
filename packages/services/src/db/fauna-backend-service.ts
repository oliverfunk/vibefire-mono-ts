// class QueryManager {
//   constructor(token) {
//     // A client is just a wrapper, it does not create a persitant connection
//     // FaunaDB behaves like an API and will include the token on each request.
//     this.headers = { "X-Fauna-Source": "fwitter-react" };
//     this.bootstrapToken =
//       token || process.env.REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY;
//     this.client = new faunadb.Client({
//       headers: this.headers,
//       secret: token || this.bootstrapToken,
//     });
//   }
// }
// import { Client, fql, Query, type QuerySuccess } from "fauna";

// class DataQueryService { QueryClient, VibefireDBClient , QueryManagerClient, DataDomainClient, QueryDomainClient, DBDomainClient
//   faunaClient: Client;
//   constructor(faunaKey: string) {
//     this.faunaClient = new Client({
//       secret: faunaKey,
//     });
//   }
// }

// var _faunaClient: QueryManagerService | undefined;
// export const getFaunaBackendService = (faunaKey: string) => {
//   "use strict";
//   if (!_faunaClient) {
//     console.debug("Creating new fauna service");
//     _faunaClient = new DataQueryService(faunaKey);
//   }
//   return _faunaClient;
// };
