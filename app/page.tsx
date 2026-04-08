import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <h1>Hotel Savi Regency MIS</h1>
      <p>Single-property dashboard designed for Jaipur operations, expandable to multi-property later.</p>
      <div className="row">
        <Link href="/login" className="btn">Login</Link>
      </div>
    </main>
  );
}
