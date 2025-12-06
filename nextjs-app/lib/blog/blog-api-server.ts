export interface Category {
  id: number
  name: string
  description: string
}

export interface BlogResponseDto {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  imageUrl: string
  category: Category
  createdAt: string
  updatedAt: string
}

export function mapApiToBlogForm(apiData: BlogResponseDto & { id?: number }): any {
  return {
    id: apiData.id,
    title: apiData.title,
    slug: apiData.slug,
    content: apiData.content,
    summary: apiData.summary,
    imageUrl: apiData.imageUrl,
    categoryId: apiData.category.id,
    categoryName: apiData.category.name,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export const blogApiServer = {
  // Lấy tất cả blogs - Server-side version
  getAllBlogs: async (): Promise<BlogResponseDto[]> => {
    try {
      const response = await fetch(`${baseURL}/api/blogs`, {
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for SSR
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching blogs:", error)
      return []
    }
  },

  // Lấy blog theo ID - Server-side version
  getBlogById: async (id: number | string): Promise<BlogResponseDto | null> => {
    try {
      const response = await fetch(`${baseURL}/api/blogs/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching blog:", error)
      return null
    }
  },

  // Lấy blogs theo category - Server-side version
  getBlogsByCategory: async (categoryId: number): Promise<BlogResponseDto[]> => {
    try {
      const response = await fetch(`${baseURL}/api/blogs/category/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching blogs by category:", error)
      return []
    }
  },

  // Lấy blog theo slug - Server-side version
  getBlogBySlug: async (slug: string): Promise<BlogResponseDto | null> => {
    try {
      const response = await fetch(`${baseURL}/api/blogs/slug/${slug}`, {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching blog by slug:", error)
      return null
    }
  },

  // Tìm kiếm blogs - Server-side version
  searchBlogs: async (query: string): Promise<BlogResponseDto[]> => {
    try {
      const response = await fetch(`${baseURL}/api/blogs/search?q=${encodeURIComponent(query)}`, {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error searching blogs:", error)
      return []
    }
  },
}
