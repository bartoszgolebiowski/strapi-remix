const clientFactory = (token: string) => {
    const URL = 'http://localhost:1337/api/';
    const client = (url: Parameters<typeof fetch>[0], int?: Parameters<typeof fetch>[1]) => fetch(`${URL}${url}`, {
        ...int,
        headers: {
            'Authorization': `Bearer ${token}`,
            ...int?.headers,
        }
    })

    const isOk = (response: Response) => {
        if (response.ok) {
            return response
        } else {
            throw new Error(response.statusText)
        }
    }

    return {
        getCategories: (): Promise<CategoryResponse> => {
            return client('categories')
                .then(isOk)
                .then(res => res.json())
        },
        getRestaurants: (query: string): Promise<RestaurantResponse> => {
            return client(`restaurants?${query}`)
                .then(isOk)
                .then(res => res.json())
        },
    }
}

type Locales = "en"
type ResponseBase<T> = {
    data: T[],
    meta: {
        "pagination": {
            "page": number,
            "pageSize": number,
            "pageCount": number,
            "total": number,
        }
    }
}

type CategoryResponse = ResponseBase<{
    "id": number
    "attributes": {
        "createdAt": string,
        "updatedAt": string,
        "publishedAt": string,
        "locale": Locales[number]
        "name": string
    }
}>

type RestaurantResponse = ResponseBase<{
    "id": number
    "attributes": {
        "createdAt": string,
        "updatedAt": string,
        "publishedAt": string,
        "locale": Locales[number]
        "name": string
        "description": string
        categories: Omit<CategoryResponse, 'meta'>
    }
}>

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY4MjU3MDAyLCJleHAiOjE2NzA4NDkwMDJ9.Yp2UikEg8vCuA5oIoI9zrKmnQJeyE9afVNptnd3vXjU"

export default clientFactory(token)