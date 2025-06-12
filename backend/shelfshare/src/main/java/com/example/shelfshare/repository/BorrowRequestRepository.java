package com.example.shelfshare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.BorrowRequestStatus;
import com.example.shelfshare.entity.BorrowRequests;

public interface BorrowRequestRepository extends CrudRepository<BorrowRequests, Integer> {

    @Query("SELECT br FROM BorrowRequests br WHERE br.requester.id = ?1")
    public List<BorrowRequests> findAllByRequesterId(Integer userId);

    @Query("SELECT br FROM BorrowRequests br WHERE br.owner.id = ?1 ORDER BY br.requestDate DESC")
    public List<BorrowRequests> findAllByBorrowerId(Integer userId);

    public BorrowRequests findFirstByBookBookIdAndRequesterUserIdAndOwnerUserIdAndStatusOrderByRequestDateAsc(Integer bookId, Integer requesterId, Integer ownerId, BorrowRequestStatus status);

    public List<BorrowRequests> findByBookBookIdAndStatus(Integer bookId, BorrowRequestStatus status);
}
