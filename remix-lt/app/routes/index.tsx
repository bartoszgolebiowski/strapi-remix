import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import client from "lib/strapi";
import qs from "qs";

const pageSize = 10;

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const field = search.get("field") || "id";
  const order = search.get("order") || "asc";
  const page = search.get("page") || "1";
  const query = qs.stringify(
    {
      sort: `${field}:${order}`,
      pagination: {
        page,
        pageSize,
      },
      populate: "*",
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  const restaurants = await client.getRestaurants(query);
  return json(restaurants);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [params] = useSearchParams();

  const currectPage = data.meta.pagination.page;
  const isFirstPage = currectPage === 1;
  const isLastPage =
    data.meta.pagination.total <=
    (currectPage + 1) * data.meta.pagination.pageSize;
  const page = params.get("page") || "1";
  const order = params.get("order") || "";
  const field = params.get("field") || "";

  const isNameOrder = field === "name" && order !== "";
  const isDescriptionOrder = field === "description" && order !== "";

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <table>
        <thead>
          <tr>
            <th>
              <Form>
                <input type="hidden" name="field" defaultValue="name" />
                <input
                  type="hidden"
                  name="order"
                  defaultValue={order === "asc" ? "desc" : "asc"}
                />
                <input type="hidden" name="page" defaultValue={"1"} />
                <button type="submit">
                  Name {isNameOrder ? (order === "asc" ? "▲" : "▼") : null}
                </button>
              </Form>
            </th>
            <th>
              <Form>
                <input type="hidden" name="field" defaultValue="description" />
                <input
                  type="hidden"
                  name="order"
                  defaultValue={order === "asc" ? "desc" : "asc"}
                />
                <input type="hidden" name="page" defaultValue={"1"} />
                <button type="submit">
                  Description{" "}
                  {isDescriptionOrder ? (order === "asc" ? "▲" : "▼") : null}
                </button>
              </Form>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>{restaurant.attributes.name}</td>
              <td>{restaurant.attributes.description}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Form>
                {order ? (
                  <input type="hidden" name="field" defaultValue={field} />
                ) : null}
                {order ? (
                  <input type="hidden" name="order" defaultValue={order} />
                ) : null}
                <input
                  type="hidden"
                  name="page"
                  defaultValue={Number(page) - 1}
                />
                <button type="submit" disabled={isFirstPage}>
                  Prev
                </button>
              </Form>
            </td>
            <td>
              <Form>
                {order ? (
                  <input type="hidden" name="field" defaultValue={field} />
                ) : null}
                {order ? (
                  <input type="hidden" name="order" defaultValue={order} />
                ) : null}
                <input
                  type="hidden"
                  name="page"
                  defaultValue={Number(page) + 1}
                />
                <button type="submit" disabled={isLastPage}>
                  Next
                </button>
              </Form>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
