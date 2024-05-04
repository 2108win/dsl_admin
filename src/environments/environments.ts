// const urlServer = 'http://103.129.127.42:5000/api/v1';
const urlServer = "https://nmt.logit.id.vn/api/v1";

//const urlServer = 'http://localhost:5000/api/v1';
export const environment = {
  production: false,
  baseURL: "http://localhost:5173",
  serverURL: {
    // apiBlog: "https://nmt.logit.id.vn/dsl/api/v1/Blog",
    // apiProduct: "https://nmt.logit.id.vn/dsl/api/v1/Product",
    // apiAuth: "https://nmt.logit.id.vn/dsl/api/v1/authenticate",
    // apiStatus: "https://nmt.logit.id.vn/dsl/api/v1/Status",
    // apiRole: "https://nmt.logit.id.vn/dsl/api/v1/role",
    // apiSizeProduct: "https://nmt.logit.id.vn/dsl/api/v1/SizeProduct",

    // apiBlog: "http://localhost:5000/api/v1/Blog",
    // apiProduct: "http://localhost:5000/api/v1/Product",
    // apiAuth: "http://localhost:5000/api/v1/authenticate",
    // apiStatus: "http://localhost:5000/api/v1/Status",
    // apiRole: "http://localhost:5000/api/v1/role",
    // apiSizeProduct: "http://localhost:5000/api/v1/SizeProduct",
    //

    apiBlog: `${urlServer}/Blog`,
    apiProduct: `${urlServer}/Product`,
    apiAuth: `${urlServer}/authenticate`,
    apiStatus: `${urlServer}/Status`,
    apiRole: `${urlServer}/role`,
    apiSizeProduct: `${urlServer}/SizeProduct`,
    apiRoute: `${urlServer}/routers`,
  },
};
