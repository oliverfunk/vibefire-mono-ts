// import { hc } from "hono/client";

// import { BASEPATH_REST } from "@vibefire/api/src/basepaths";
// import { type RestRouter } from "@vibefire/api/src/rest";

// import { apiBaseUrl } from "./api-base-url";

// export const honoUrl = `${apiBaseUrl()}${BASEPATH_REST}`;
// export const hono = hc<RestRouter>(honoUrl);

// const useGetImage = (imageKey: string) =>
//   useQuery({
//     queryKey: [imageKey],
//     queryFn: async () => {
//       const res = await $getImage({
//         param: {
//           "image-key": imageKey,
//         },
//       });
//       return res;
//     },
//   });

// const mutation = useMutation<
// InferResponseType<typeof $uploadImage>,
// Error,
// InferRequestType<typeof $uploadImage>["json"]
// >(
// async (input) => {
//   const res = await $uploadImage({
//     json: input,
//   });
//   return await res.json();
// },
// {
//   onSuccess: async () => {
//     // queryClient.invalidateQueries({ queryKey: ["todos"] });
//   },
//   onError: (error) => {
//     console.log(error);
//   },
// },
// );
