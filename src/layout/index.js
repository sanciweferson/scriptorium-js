import { Footer } from "@layout/footer";
import { Header } from "@layout/header";


export function Layout ({children}){
  return /* html */ `
  ${Header()}
  <main class="main">
  ${children}
  </main>
  ${Footer()}
  `
}