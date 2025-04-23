async function Searchpage({
  searchParams,
}: {
  searchParams: {
    query: string;
  };
}) {
  const { query } = await searchParams;
  const 

  return <div>Searching for {query}</div>;
}

export default Searchpage;
