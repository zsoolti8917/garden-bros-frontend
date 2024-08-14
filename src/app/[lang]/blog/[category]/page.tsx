import PageHeader from '@/app/[lang]/components/PageHeader';
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import BlogList from '@/app/[lang]/views/blog-list';
import Link from 'next/link';
async function fetchPostsByCategory(filter: string) {
    try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const path = `/articles`;
        const urlParamsObject = {
            sort: { createdAt: 'desc' },
            filters: {
                category: {
                    slug: filter,
                },
            },
            populate: {
                cover: { fields: ['url'] },
                category: {
                    populate: '*',
                },
                authorsBio: {
                    populate: '*',
                },
            },
        };
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const responseData = await fetchAPI(path, urlParamsObject, options);
        return responseData;
    } catch (error) {
        console.error(error);
    }
}

export default async function CategoryRoute({ params }: { params: { category: string } }) {
    const filter = params.category;
    const { data } = await fetchPostsByCategory(filter);

    //TODO: CREATE A COMPONENT FOR THIS

    if (data.length === 0) {
        return (
            <div className='text-4xl text-center text-primary-700 font-bold flex flex-col w-full min-h-[80vh] items-center justify-center'>
                <p className='mx-auto my-4'>V tejto kategórii nie sú žiadne príspevky</p>
                <Link href='/blog' className='px-6 py-3 text-sm rounded-lg hover:underline text-white bg-primary-500'>
                    Prejdite na blog
                </Link>
            </div>
        );
    }
    

    const { name, description } = data[0]?.attributes.category.data.attributes;

    return (
        <div>
            <PageHeader heading={name} text={description} />
            <BlogList data={data} />
        </div>
    );
}

export async function generateStaticParams() {
    return [];
}
