package com.comanda.service;

import com.comanda.dto.request.PedidoCompraRequest;
import com.comanda.dto.response.PedidoCompraResponse;
import com.comanda.entity.*;
import com.comanda.enums.StatusPedidoCompra;
import com.comanda.exception.BusinessException;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.PedidoCompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoCompraService {

    private final PedidoCompraRepository repository;
    private final FornecedorService fornecedorService;
    private final IngredienteService ingredienteService;
    private final EstoqueService estoqueService;

    public List<PedidoCompraResponse> listarTodos() {
        return repository.findAllByOrderByCriadoEmDesc().stream().map(this::toResponse).toList();
    }

    public PedidoCompraResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public PedidoCompraResponse criar(PedidoCompraRequest req) {
        Fornecedor fornecedor = fornecedorService.findById(req.getFornecedorId());
        List<PedidoCompraItem> itens = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : req.getItens()) {
            Ingrediente ing = ingredienteService.findById(itemReq.getIngredienteId());
            BigDecimal subtotal = itemReq.getPrecoUnitario().multiply(itemReq.getQuantidade());
            PedidoCompraItem item = PedidoCompraItem.builder()
                .ingrediente(ing).quantidade(itemReq.getQuantidade())
                .precoUnitario(itemReq.getPrecoUnitario()).subtotal(subtotal)
                .build();
            itens.add(item);
            total = total.add(subtotal);
        }

        PedidoCompra pc = PedidoCompra.builder()
            .fornecedor(fornecedor).status(StatusPedidoCompra.RASCUNHO)
            .total(total).itens(itens).build();
        itens.forEach(i -> i.setPedidoCompra(pc));
        return toResponse(repository.save(pc));
    }

    @Transactional
    public PedidoCompraResponse enviar(Long id) {
        PedidoCompra pc = findById(id);
        if (pc.getStatus() != StatusPedidoCompra.RASCUNHO) {
            throw new BusinessException("Apenas pedidos em rascunho podem ser enviados.");
        }
        pc.setStatus(StatusPedidoCompra.ENVIADO);
        return toResponse(repository.save(pc));
    }

    @Transactional
    public PedidoCompraResponse receber(Long id, Usuario usuario) {
        PedidoCompra pc = findById(id);
        if (pc.getStatus() != StatusPedidoCompra.ENVIADO) {
            throw new BusinessException("Apenas pedidos enviados podem ser recebidos.");
        }
        pc.setStatus(StatusPedidoCompra.RECEBIDO);
        String ref = "#PC-" + pc.getId();
        for (PedidoCompraItem item : pc.getItens()) {
            estoqueService.registrarEntrada(item.getIngrediente(), item.getQuantidade(), item.getPrecoUnitario(), ref, usuario);
        }
        return toResponse(repository.save(pc));
    }

    private PedidoCompra findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido de Compra", id));
    }

    private PedidoCompraResponse toResponse(PedidoCompra pc) {
        List<PedidoCompraResponse.PedidoCompraItemResponse> itens = pc.getItens().stream()
            .map(i -> PedidoCompraResponse.PedidoCompraItemResponse.builder()
                .id(i.getId())
                .ingredienteId(i.getIngrediente().getId())
                .ingredienteNome(i.getIngrediente().getNome())
                .unidade(i.getIngrediente().getUnidade().name())
                .quantidade(i.getQuantidade())
                .precoUnitario(i.getPrecoUnitario())
                .subtotal(i.getSubtotal())
                .build()).toList();
        return PedidoCompraResponse.builder()
            .id(pc.getId())
            .fornecedorId(pc.getFornecedor().getId())
            .fornecedorNome(pc.getFornecedor().getRazaoSocial())
            .status(pc.getStatus()).total(pc.getTotal())
            .criadoEm(pc.getCriadoEm()).itens(itens)
            .build();
    }
}
