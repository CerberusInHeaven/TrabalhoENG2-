import * as fs from "fs";
const Prompt = require("prompt-sync")();

interface LivroData {
  titulo: string;
  autor: string;
  ISBN: string;
  ano: number;
}

export class Livro {
  private _titulo: string;
  private _autor: string = "";
  private _ISBN: string = "0000000000000"; //'000-0-00-000000-0'
  private _ano: number = 0;

  constructor(titulo: string, autor: string, ISBN: string, ano: number) {
    this._titulo = titulo;
    this._autor = autor;
    this._ISBN = ISBN;
    this._ano = ano;
  }

  get ISBN(): string {
    return this._ISBN;
  }

  private validarDados(titulo: string, autor: string, ISBN: string, ano: number): boolean {
    if (!titulo || !autor) {
      console.log("Título e Autor são obrigatórios!");
      return false;
    }
      //metodo de validação adicionado para a atividade em grupo ^~^
    if (!/^\d{13}$/.test(ISBN)) {
      console.log("ISBN inválido! O ISBN deve conter 13 dígitos.");
      return false;
    }

    if (isNaN(ano) || ano < 0 || ano > new Date().getFullYear()) {
      console.log("Ano inválido! Deve ser um número positivo e não pode ser maior que o ano atual.");
      return false;
    }

    return true;
  }
//metodo de validação adicionado para a atividade em grupo ^~^
  public adicionar(): void {
    if (!this.validarDados(this._titulo, this._autor, this._ISBN, this._ano)) {
      return;
    }

    const livroData: LivroData = {
      titulo: this._titulo,
      autor: this._autor,
      ISBN: this._ISBN,
      ano: this._ano,
    };

    let livros: LivroData[] = [];
    if (fs.existsSync("./data/livros.json")) {
      const data = fs.readFileSync("./data/livros.json", "utf-8");
      livros = JSON.parse(data);
    }
    livros.push(livroData);

    fs.writeFileSync("./data/livros.json", JSON.stringify(livros, null, 2));
  }

  public atualizar(): void {
    let ISBN = Prompt("Digite o ISBN do livro que deseja atualizar: ");

    if (fs.existsSync("./data/livros.json")) {
      const data = fs.readFileSync("./data/livros.json", "utf-8");
      const livros: LivroData[] = JSON.parse(data);
      let livro = livros.find((livro: LivroData) => livro.ISBN === ISBN);

      if (livro) {
        let titulo = Prompt("Título: ");
        let autor = Prompt("Autor: ");
        let novoISBN = Prompt("ISBN: ");
        let ano = parseInt(Prompt("Ano: "));

        if (!this.validarDados(titulo, autor, novoISBN, ano)) {
          return;
        }

        livro.titulo = titulo;
        livro.autor = autor;
        livro.ISBN = novoISBN;
        livro.ano = ano;

        fs.writeFileSync("./data/livros.json", JSON.stringify(livros, null, 2));
      } else {
        console.log("Livro não encontrado!");
      }
    }
  }

  public listar(): void {
    if (fs.existsSync("./data/livros.json")) {
      const data = fs.readFileSync("./data/livros.json", "utf-8");
      const livros: LivroData[] = JSON.parse(data);
      console.table(livros);
    } else {
      console.log("Arquivo não encontrado!");
    }
  }

  public deletar(): void {
    if (fs.existsSync("./data/livros.json")) {
      let ISBN = Prompt("Digite o ISBN do livro que deseja deletar: ");
      const data = fs.readFileSync("./data/livros.json", "utf-8");
      let livros: LivroData[] = JSON.parse(data);
      let livro = livros.find((livro: LivroData) => livro.ISBN === ISBN);

      if (livro) {
        let index = livros.indexOf(livro);
        livros.splice(index, 1);
        fs.writeFileSync("./data/livros.json", JSON.stringify(livros, null, 2));
      } else {
        console.log("Livro não encontrado!");
      }
    }
  }
}
