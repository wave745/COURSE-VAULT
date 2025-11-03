import { Navbar } from "../Navbar";
import { useState } from "react";

export default function NavbarExample() {
  const [search, setSearch] = useState("");
  return <Navbar searchValue={search} onSearchChange={setSearch} />;
}
