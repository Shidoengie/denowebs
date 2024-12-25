import * as router from "./src/router.ts";

import { registerContent, registerPartials, view } from "./src/templates.ts";
import { MimeType } from "./src/mimetypes.ts"
if (!import.meta.main) {
  throw new Error("cannot be used as library");
}
async function getRoutes() {
  const [error,home] = await Promise.all([view("/error.hbs"),view("/view.hbs")])
  router.setErrorPage(error)

  router.obj("/",{
    GET() {
      return new Response(home({}), {
        headers: {
          "content-type": MimeType.Html,

        },
      });
    },
    async POST(request){
      const formData = await request.formData();

      return new Response(JSON.stringify(Object.fromEntries(formData)), {headers:{"content-type": MimeType.Json}});
    }
  });
  router.any("/test/",(req,groups) => {
    const params = new URL(req.url).searchParams;
    let buffer = JSON.stringify(Array.from(params.entries()))
    return new Response(buffer, {
      headers: {
        "content-type": MimeType.Json,
        
      }
    })
  })
}
Deno.serve(async (req) => {
  registerContent();
  await getRoutes()
  return router.serve(req);
});
