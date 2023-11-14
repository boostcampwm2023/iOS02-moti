//
//  HomeViewController.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Combine
import Core

final class HomeViewController: BaseViewController<HomeView> {

    // MARK: - Properties
    weak var coordinator: HomeCoordinator?
    private let recordListViewModel: RecordListViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    init(recordListViewModel: RecordListViewModel) {
        self.recordListViewModel = recordListViewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        bind()
        setupDataSource()
        
        try? recordListViewModel.fetchRecordList()
    }
    
    // MARK: - Setup
    private func bind() {
        recordListViewModel.$records
            .receive(on: RunLoop.main)
            .sink { [weak self] records in
                guard let self else { return }
                
                self.recordListViewModel.updateDataSource(records: records)
            }
            .store(in: &cancellables)
    }
    
    private func setupDataSource() {
        layoutView.recordCollectionView.delegate = self
        let dataSource = RecordDiffableDataSource.DataSource(
            collectionView: layoutView.recordCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: RecordCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                
                if item.id.isEmpty {
                    cell.showSkeleton()
                } else {
                    cell.hideSkeleton()
                    cell.configure(imageURL: item.imageURL)
                }
                
                return cell
            }
        )
        
        dataSource.supplementaryViewProvider = { collecionView, elementKind, indexPath in
            guard elementKind == UICollectionView.elementKindSectionHeader else { return nil }
            
            let headerView = collecionView.dequeueReusableSupplementaryView(
                ofKind: elementKind,
                withReuseIdentifier: HeaderView.identifier,
                for: indexPath) as? HeaderView
            
            headerView?.configure(category: "다이어트")
            headerView?.configure(title: "32회 달성")
            headerView?.configure(date: "2023-11-03")
            return headerView
        }
        
        let diffableDataSource = RecordDiffableDataSource(dataSource: dataSource)
        
        diffableDataSource.update(with: recordListViewModel.records)
        
        recordListViewModel.setupDataSource(diffableDataSource)
    }
}

extension HomeViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didEndDisplaying cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        guard let cell = cell as? RecordCollectionViewCell else { return }
        cell.cancelDownloadImage()
    }
}
