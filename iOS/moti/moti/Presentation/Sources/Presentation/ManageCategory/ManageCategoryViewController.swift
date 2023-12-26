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
        // viewModel.action()
        delegate?.doneButtonDidClicked()
    }
    
    private func setupManageCategoryCollectionView() {
        setupManageCategoryDataSource()
        
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
}

extension ManageCategoryViewController: UICollectionViewDelegate {
    
}
