import HeaderClient from "./headerClient";

export default async function Home() {
  const [genresResponse] = await Promise.all([
    fetch(`${process.env.API_URL}/api/genres?populate=*`, {}),
  ]);

  const [genres] = await Promise.all([genresResponse.json()]);
  console.log(genres);

  return <HeaderClient initialData={{ genres }} />;
}
