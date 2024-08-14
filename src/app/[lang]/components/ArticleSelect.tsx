import Link from "next/link";

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    articles: {
      data: Array<{}>;
    };
  };
}

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
  };
}

function selectedFilter(current: string, selected: string) {
  return current === selected
    ? "px-3 py-1 rounded-lg hover:underline dark:bg-primary-800 dark:text-white"
    : "px-3 py-1 rounded-lg hover:underline dark:bg-primary-500 dark:text-white";
}

export default function ArticleSelect({
  categories,
  articles,
  params,
}: {
  categories: Category[];
  articles: Article[];
  params: {
    slug: string;
    category: string;
  };
}) {
  return (
    <div className="sticky  p-4 rounded-lg bg-primary-700 min-h-[365px] text-white top-[110px] shadow-2xl">
      <h4 className="text-xl font-semibold">Hľadať podľa kategorií</h4>

      <div>
        <div className="flex flex-wrap py-6 gap-4  dark:border-gray-400">
          {categories.map((category: Category, index: number) => {
            if (category.attributes.articles.data.length === 0) return null;
            return (
              <Link
                key={index}
                href={`/blog/${category.attributes.slug}`}
                className={selectedFilter(
                  category.attributes.slug,
                  params.category
                )}
              >
                #{category.attributes.name}
              </Link>
            );
          })}
          <Link href={"/blog"} className={selectedFilter("", "filter")}>
            #all
          </Link>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Ďalšie súvisiace projekty</h4>
          <ul className="ml-4 space-y-1 list-disc">
            {articles.map((article: Article, index: number) => {
              return (
                <li key={index}>
                  <Link
                    rel="noopener noreferrer"
                    href={`/blog/${params.category}/${article.attributes.slug}`}
                    className={`${
                      params.slug === article.attributes.slug &&
                      "text-white font-bold underline"
                    }  hover:underline hover:text-primary-500  transition-colors duration-200`}
                  >
                    {article.attributes.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
