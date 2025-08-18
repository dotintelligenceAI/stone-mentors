#!/bin/bash

echo "Iniciando aplicação..."

# Verificar se a pasta dist existe
if [ ! -d "dist" ]; then
    echo "ERRO: Pasta dist não encontrada!"
    echo "Conteúdo do diretório atual:"
    ls -la
    exit 1
fi

echo "Pasta dist encontrada. Conteúdo:"
ls -la dist/

# Verificar se o package.json existe
if [ ! -f "package.json" ]; then
    echo "ERRO: package.json não encontrado!"
    exit 1
fi

echo "Instalando dependências..."
npm install

echo "Iniciando servidor..."
npm start
