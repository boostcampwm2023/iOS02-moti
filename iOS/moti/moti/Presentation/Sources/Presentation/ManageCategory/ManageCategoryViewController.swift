//
//  ManageCategoryViewController.swift
//
//
//  Created by Kihyun Lee on 12/25/23.
//

import UIKit
import Combine
import Core
import Domain

protocol ManageCategoryViewControllerDelegate: AnyObject {
    func cancelButtonDidClicked()
    func doneButtonDidClicked()
}

final class ManageCategoryViewController: BaseViewController<ManageCategoryView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: ManageCategoryCoordinator?
    private let viewModel: ManageCategoryViewModel
    private var cancellables: Set<AnyCancellable> = []
    weak var delegate: ManageCategoryViewControllerDelegate?
    
    // MARK: - Init
    init(viewModel: ManageCategoryViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationBar()
        bind()
        setupManageCategoryCollectionView()
    }
    
    private func setupNavigationBar() {
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "취소", style: .plain, target: self, 
                                                           action: #selector(cancelButtonDidClicked))
        
        let removeButton = UIBarButtonItem(title: "삭제", style: .plain, target: self, action: #selector(removeButtonDidClicked))
        removeButton.tintColor = .red
        let doneButton = UIBarButtonItem(title: "완료", style: .plain, target: self, action: #selector(doneButtonDidClicked))
        navigationItem.rightBarButtonItems = [doneButton, removeButton]
        
    }
    
    @objc private func cancelButtonDidClicked() {
        delegate?.cancelButtonDidClicked()
    }
    
    @objc private func removeButtonDidClicked() {
        print("remove ..")
    }
    
    @objc private func doneButtonDidClicked() {
        viewModel.action(.reorderCategories)
    }
    
    private func setupManageCategoryCollectionView() {
        setupManageCategoryDataSource()
        setupManageCategoryDragDrop()
    }
    
    private func setupManageCategoryDataSource() {
        layoutView.manageCategoryCollectionView.delegate = self
        let dataSource = ManageCategoryViewModel.CategoryDataSource.DataSource(
            collectionView: layoutView.manageCategoryCollectionView,
            cellProvider: { [weak self] collectionView, indexPath, item in
                guard let self else {
                    return UICollectionViewCell()
                }
                let cell: ManageCategoryCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                return cell
            }
        )
        
        let diffableDataSource = ManageCategoryViewModel.CategoryDataSource(dataSource: dataSource)
        viewModel.setupDataSource(diffableDataSource)
    }
    
    private func setupManageCategoryDragDrop() {
        layoutView.manageCategoryCollectionView.dragDelegate = self
        layoutView.manageCategoryCollectionView.dropDelegate = self
        layoutView.manageCategoryCollectionView.dragInteractionEnabled = true
    }
}

private extension ManageCategoryViewController {
    func bind() {
        viewModel.reorderCategoriesState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .success:
                    delegate?.doneButtonDidClicked()
                case .failed(let message):
                    showErrorAlert(message: message)
                }
                
            }
            .store(in: &cancellables)
    }
}

extension ManageCategoryViewController: UICollectionViewDelegate {
    
}

extension ManageCategoryViewController: UICollectionViewDragDelegate {
    func collectionView(
        _ collectionView: UICollectionView,
        itemsForBeginning session: UIDragSession, 
        at indexPath: IndexPath
    ) -> [UIDragItem] {
        return [UIDragItem(itemProvider: NSItemProvider())]
    }
}

extension ManageCategoryViewController: UICollectionViewDropDelegate {
    func collectionView(_ collectionView: UICollectionView, performDropWith coordinator: UICollectionViewDropCoordinator) {
        var destinationIndexPath: IndexPath
        if let indexPath = coordinator.destinationIndexPath {
            destinationIndexPath = indexPath
        } else {
            let row = collectionView.numberOfItems(inSection: 0)
            destinationIndexPath = IndexPath(item: row - 1, section: 0)
        }
        
        guard coordinator.proposal.operation == .move else { return }
        move(coordinator: coordinator, destinationIndexPath: destinationIndexPath, collectionView: collectionView)
    }
    
    private func move(coordinator: UICollectionViewDropCoordinator, destinationIndexPath: IndexPath, collectionView: UICollectionView) {
        guard
            let sourceItem = coordinator.items.first,
            let sourceIndexPath = sourceItem.sourceIndexPath
        else { return }
        
        collectionView.performBatchUpdates { [weak self] in
            self?.move(sourceIndexPath: sourceIndexPath, destinationIndexPath: destinationIndexPath)
        } completion: { finish in
            coordinator.drop(sourceItem.dragItem, toItemAt: destinationIndexPath)
        }
    }
    
    private func move(sourceIndexPath: IndexPath, destinationIndexPath: IndexPath) {
        let sourceItem = viewModel.categories[sourceIndexPath.item]
        
        // dataSource 이동
        viewModel.categories.remove(at: sourceIndexPath.item)
        viewModel.categories.insert(sourceItem, at: destinationIndexPath.item)
    }
    
    func collectionView(
        _ collectionView: UICollectionView,
        dropSessionDidUpdate session: UIDropSession,
        withDestinationIndexPath destinationIndexPath: IndexPath?
    ) -> UICollectionViewDropProposal {
        guard collectionView.hasActiveDrag else {
            return UICollectionViewDropProposal(operation: .forbidden)
        }
        return UICollectionViewDropProposal(operation: .move, intent: .insertAtDestinationIndexPath)
    }
}
