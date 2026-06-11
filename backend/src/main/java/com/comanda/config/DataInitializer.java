package com.comanda.config;

import com.comanda.entity.*;
import com.comanda.enums.*;
import com.comanda.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final PratoRepository pratoRepository;
    private final IngredienteRepository ingredienteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) return;

        log.info("Inicializando dados de desenvolvimento...");

        Usuario admin = usuarioRepository.save(Usuario.builder()
            .nome("Admin Sistema").email("admin@comanda.com")
            .senha(passwordEncoder.encode("admin123"))
            .perfil(PerfilUsuario.ADMIN).status(StatusUsuario.ATIVO).build());

        usuarioRepository.save(Usuario.builder()
            .nome("Ana Gerente").email("gerente@comanda.com")
            .senha(passwordEncoder.encode("gerente123"))
            .perfil(PerfilUsuario.GERENTE).status(StatusUsuario.ATIVO).build());

        usuarioRepository.save(Usuario.builder()
            .nome("Pedro Cozinheiro").email("cozinha@comanda.com")
            .senha(passwordEncoder.encode("cozinha123"))
            .perfil(PerfilUsuario.COZINHEIRO).status(StatusUsuario.ATIVO).build());

        usuarioRepository.save(Usuario.builder()
            .nome("Cliente Teste").email("cliente@comanda.com")
            .senha(passwordEncoder.encode("cliente123"))
            .telefone("(11) 99999-0000").endereco("Rua das Flores, 123")
            .perfil(PerfilUsuario.CLIENTE).status(StatusUsuario.ATIVO).build());

        Categoria lanches = categoriaRepository.save(Categoria.builder().nome("Lanches").descricao("Hambúrgueres e sanduíches").ordem(1).status(StatusCategoria.ATIVO).build());
        Categoria acai = categoriaRepository.save(Categoria.builder().nome("Açaí").descricao("Bowls e tigelas").ordem(2).status(StatusCategoria.ATIVO).build());
        Categoria asiaticos = categoriaRepository.save(Categoria.builder().nome("Asiáticos").descricao("Bowls e wraps asiáticos").ordem(3).status(StatusCategoria.ATIVO).build());
        Categoria wraps = categoriaRepository.save(Categoria.builder().nome("Wraps").descricao("Wraps crocantes").ordem(4).status(StatusCategoria.ATIVO).build());
        Categoria bebidas = categoriaRepository.save(Categoria.builder().nome("Bebidas").descricao("Sucos, limonadas e refrigerantes").ordem(5).status(StatusCategoria.ATIVO).build());

        pratoRepository.save(Prato.builder().nome("Burger Artesanal").descricao("180g de blend bovino premium, pão brioche, queijo cheddar, alface americana, tomate e molho especial da casa.").emoji("🍔").categoria(lanches).preco(new BigDecimal("39.90")).custo(new BigDecimal("15.30")).tempoPreparo(12).status(StatusPrato.ATIVO).build());
        pratoRepository.save(Prato.builder().nome("Açaí 500ml").descricao("Açaí cremoso com granola crocante, banana em rodelas e leite condensado.").emoji("🍦").categoria(acai).preco(new BigDecimal("22.90")).custo(new BigDecimal("5.80")).tempoPreparo(5).status(StatusPrato.ATIVO).build());
        pratoRepository.save(Prato.builder().nome("Bowl Asiático").descricao("Salmão grelhado, arroz japonês, edamame, cenoura, pepino e molho teriyaki artesanal.").emoji("🍣").categoria(asiaticos).preco(new BigDecimal("32.90")).custo(new BigDecimal("10.80")).tempoPreparo(15).status(StatusPrato.ATIVO).build());
        pratoRepository.save(Prato.builder().nome("Wrap Crocante").descricao("Frango crocante empanado, cream cheese, alface, tomate, milho e molho chipotle.").emoji("🌮").categoria(wraps).preco(new BigDecimal("28.90")).custo(new BigDecimal("8.40")).tempoPreparo(10).status(StatusPrato.PAUSADO).build());
        pratoRepository.save(Prato.builder().nome("Limonada Suíça").descricao("Limonada cremosa com leite condensado, limão siciliano e hortelã. 500ml.").emoji("🥤").categoria(bebidas).preco(new BigDecimal("12.90")).custo(new BigDecimal("3.20")).tempoPreparo(3).status(StatusPrato.ATIVO).build());
        pratoRepository.save(Prato.builder().nome("Suco de Laranja").descricao("Suco natural de laranja espremido na hora. 400ml.").emoji("🍊").categoria(bebidas).preco(new BigDecimal("9.90")).custo(new BigDecimal("2.50")).tempoPreparo(3).status(StatusPrato.ATIVO).build());
        pratoRepository.save(Prato.builder().nome("Smash Burger").descricao("Blend angus prensado, queijo americano derretido, picles crocante e molho smash.").emoji("🍔").categoria(lanches).preco(new BigDecimal("44.90")).custo(new BigDecimal("17.80")).tempoPreparo(14).status(StatusPrato.ATIVO).build());
        pratoRepository.save(Prato.builder().nome("Açaí 300ml").descricao("Versão menor do nosso açaí premium.").emoji("🍦").categoria(acai).preco(new BigDecimal("16.90")).custo(new BigDecimal("3.80")).tempoPreparo(4).status(StatusPrato.ATIVO).build());

        ingredienteRepository.save(Ingrediente.builder().nome("Blend Bovino").sku("ING-001").unidade(UnidadeMedida.G).saldoAtual(new BigDecimal("480")).estoqueMinimo(new BigDecimal("1000")).custoUnitario(new BigDecimal("0.0450")).status(StatusEstoque.CRITICO).build());
        ingredienteRepository.save(Ingrediente.builder().nome("Pão Brioche").sku("ING-002").unidade(UnidadeMedida.UN).saldoAtual(new BigDecimal("43")).estoqueMinimo(new BigDecimal("10")).custoUnitario(new BigDecimal("2.8000")).status(StatusEstoque.OK).build());
        ingredienteRepository.save(Ingrediente.builder().nome("Queijo Cheddar").sku("ING-003").unidade(UnidadeMedida.G).saldoAtual(new BigDecimal("340")).estoqueMinimo(new BigDecimal("500")).custoUnitario(new BigDecimal("0.0650")).status(StatusEstoque.BAIXO).build());
        ingredienteRepository.save(Ingrediente.builder().nome("Abacate").sku("ING-007").unidade(UnidadeMedida.G).saldoAtual(new BigDecimal("120")).estoqueMinimo(new BigDecimal("1000")).custoUnitario(new BigDecimal("0.0180")).status(StatusEstoque.CRITICO).build());
        ingredienteRepository.save(Ingrediente.builder().nome("Açaí Polpa").sku("ING-010").unidade(UnidadeMedida.G).saldoAtual(new BigDecimal("4200")).estoqueMinimo(new BigDecimal("2000")).custoUnitario(new BigDecimal("0.0220")).status(StatusEstoque.OK).build());

        log.info("Dados de desenvolvimento carregados com sucesso.");
    }
}
