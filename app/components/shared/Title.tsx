export default function Title(props: { title: string }) {
    return (
        <div className="mx-auto w-max pt-16">
            <h1 className="mb-4 prose prose-stone text-4xl font-bold dark:prose-invert">{props.title}</h1>
        </div>
    );
}
