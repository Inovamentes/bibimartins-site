#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
  printf "\n==> %s\n" "$1"
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

ensure_brew() {
  if has_cmd brew; then
    return 0
  fi

  echo "Homebrew nao encontrado."
  echo "Instale o Homebrew e execute novamente:"
  echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  exit 1
}

ensure_formula() {
  local formula="$1"
  if brew list --formula "$formula" >/dev/null 2>&1; then
    echo "- $formula: OK"
  else
    log "Instalando $formula via Homebrew"
    brew install "$formula"
  fi
}

log "Validando dependencias de sistema"
ensure_brew
ensure_formula node
ensure_formula openjdk@21
ensure_formula maven

if ! has_cmd java; then
  log "Configurando JAVA_HOME para esta sessao"
  export JAVA_HOME="$(/usr/libexec/java_home -v 21 2>/dev/null || true)"
  if [ -n "${JAVA_HOME:-}" ]; then
    export PATH="$JAVA_HOME/bin:$PATH"
  fi
fi

if ! has_cmd java; then
  echo "Java 21 nao esta disponivel no PATH."
  echo "Rode estes comandos e tente novamente:"
  echo '  echo '\''export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"'\'' >> ~/.zshrc'
  echo '  source ~/.zshrc'
  exit 1
fi

if ! has_cmd npm; then
  echo "npm nao encontrado no PATH apos instalacao do Node."
  exit 1
fi

if ! has_cmd mvn; then
  echo "mvn nao encontrado no PATH apos instalacao do Maven."
  exit 1
fi

log "Instalando dependencias do frontend"
cd "$ROOT_DIR"
npm install

log "Buildando backend (sem testes)"
cd "$ROOT_DIR/backend"
mvn clean package -DskipTests

log "Bootstrap concluido com sucesso"
echo "Frontend pronto e backend compilado."
echo "Proximo passo (backend deploy):"
echo "  cd \"$ROOT_DIR/backend\" && docker build -t bibimartins-backend ."
