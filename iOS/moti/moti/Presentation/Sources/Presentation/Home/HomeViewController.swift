//
//  HomeViewController.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Combine
import Core
import Data
import Domain

final class HomeViewController: BaseViewController<HomeView> {

    // MARK: - Properties
    weak var coordinator: HomeCoordinator?
    private let viewModel: HomeViewModel
    private var cancellables: Set<AnyCancellable> = []
    private var isFetchingNextPage = false
    
    init(viewModel: HomeViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        addTargets()
        bind()
        
        setupAchievementDataSource()
        setupCategoryDataSource()
        
        viewModel.action(.launch)
    }
    
    // MARK: - Methods
    func delete(achievementId: Int) {
        viewModel.action(.delete(achievementId: achievementId))
    }
    
    func updateAchievement(achievementId: Int, newCategoryId: Int) {
        viewModel.action(.updateAchievement(id: achievementId, newCategoryId: newCategoryId))
    }
    
    func postAchievement(newAchievement: Achievement) {
        print("막전")
        viewModel.action(.postAchievement(newAchievement: newAchievement))
    }
    
    private func bind() {
        viewModel.$achievementState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                // state 에 따른 뷰 처리 - 스켈레톤 뷰, fetch 에러 뷰 등
                Logger.debug(state)
                switch state {
                case .finish:
                    isFetchingNextPage = false
                case .error(let message):
                    isFetchingNextPage = false
                    Logger.error("Fetch Achievement Error: \(message)")
                default: break
                }
                
            }
            .store(in: &cancellables)
        
        viewModel.$categoryListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] categoryState in
                guard let self else { return }
                switch categoryState {
                case .initial:
                    // TODO: 스켈레톤
                    break
                case .finish:
                    // 첫 번째 아이템 선택
                    self.selectFirstCategory()
                case .error(let message):
                    Logger.error("Category State Error: \(message)")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$addCategoryState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    layoutView.catergoryAddButton.isEnabled = false
                case .finish:
                    layoutView.catergoryAddButton.isEnabled = true
                case .error(let message):
                    layoutView.catergoryAddButton.isEnabled = true
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.$categoryState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .initial: break
                case .updated(let category):
                    Logger.debug("Updated: \(category)")
                    layoutView.updateAchievementHeader(with: category)
                }
            }
            .store(in: &cancellables)
    }
    
    private func addTargets() {
        layoutView.catergoryAddButton.addTarget(self, action: #selector(showAlert), for: .touchUpInside)
    }
    
    @objc private func showAlert() {
        showTextFieldAlert(
            title: "추가할 카테고리 이름을 입력하세요.",
            okTitle: "생성",
            placeholder: "카테고리 이름은 최대 10글자입니다."
        ) { [weak self] text in
            guard let self, let text else { return }
            viewModel.action(.addCategory(name: text))
        }
    }
    
    private func showErrorAlert(message: String) {
        showOneButtonAlert(title: "에러", message: message)
    }
    
    // MARK: - Setup
    private func setupAchievementDataSource() {
        layoutView.achievementCollectionView.delegate = self
        let dataSource = HomeViewModel.AchievementDataSource.DataSource(
            collectionView: layoutView.achievementCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: AchievementCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                
                if item.id < 0 {
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
            
            return headerView
        }
        
        let diffableDataSource = HomeViewModel.AchievementDataSource(dataSource: dataSource)
        viewModel.setupAchievementDataSource(diffableDataSource)
    }
    
    private func setupCategoryDataSource() {
        layoutView.categoryCollectionView.delegate = self
        let dataSource = HomeViewModel.CategoryDataSource.DataSource(
            collectionView: layoutView.categoryCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: CategoryCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                return cell
            }
        )
        
        let diffableDataSource = HomeViewModel.CategoryDataSource(dataSource: dataSource)
        viewModel.setupCategoryDataSource(diffableDataSource)
    }
    
    private func selectFirstCategory() {
        let firstIndexPath = IndexPath(item: 0, section: 0)
        layoutView.categoryCollectionView.selectItem(at: firstIndexPath, animated: false, scrollPosition: .init())
        collectionView(layoutView.categoryCollectionView.self, didSelectItemAt: firstIndexPath)
    }
}

extension HomeViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        if let cell = collectionView.cellForItem(at: indexPath) as? CategoryCollectionViewCell {
            // 카테고리 셀을 눌렀을 때
            categoryCellDidSelected(cell: cell, row: indexPath.row)
        } else if let cell = collectionView.cellForItem(at: indexPath) as? AchievementCollectionViewCell {
            // 달성 기록 리스트 셀을 눌렀을 때
            // 상세 정보 화면으로 이동
            let achievement = viewModel.findAchievement(at: indexPath.row)
            coordinator?.moveToDetailAchievementViewController(achievement: achievement)
        }
    }
    
    private func categoryCellDidSelected(cell: CategoryCollectionViewCell, row: Int) {
        // 눌렸을 때 Bounce 적용
        // Highlight에만 적용하면 Select에서는 적용이 안 되서 별도로 적용함
        UIView.animate(withDuration: 0.08, animations: {
            cell.applyHighlightUI()
            let scale = CGAffineTransform(scaleX: 0.95, y: 0.95)
            cell.transform = scale
        }, completion: { _ in
            cell.transform = .identity
        })
        
        guard let category = viewModel.findCategory(at: row) else { return }
        Logger.debug("Selected Category: \(category.name)")
        viewModel.action(.fetchCategoryList(category: category))
        layoutView.updateAchievementHeader(with: category)
    }
    
    func collectionView(_ collectionView: UICollectionView, willDisplaySupplementaryView view: UICollectionReusableView, forElementKind elementKind: String, at indexPath: IndexPath) {
        guard elementKind == UICollectionView.elementKindSectionHeader,
              let headerView = view as? HeaderView else { return }
        
        if let currentCategory = viewModel.currentCategory {
            headerView.configure(category: currentCategory)
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, didEndDisplaying cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        guard let cell = cell as? AchievementCollectionViewCell else { return }
        cell.cancelDownloadImage()
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let actualPos = scrollView.panGestureRecognizer.translation(in: scrollView.superview)
        let pos = scrollView.contentOffset.y
        let diff = layoutView.achievementCollectionView.contentSize.height - scrollView.frame.size.height
        
        // 아래로 드래그 && 마지막까지 스크롤
        if actualPos.y < 0 && pos > diff && !isFetchingNextPage {
            Logger.debug("Fetch New Data")
            isFetchingNextPage = true
            viewModel.action(.fetchNextPage)
        }
    }
}
