//
//  EditAchievementViewModel.swift
//
//
//  Created by 유정주 on 11/23/23.
//

import Foundation
import Domain
import Core

final class EditAchievementViewModel {
    
    enum Action {
        case saveImage(data: Data)
        case fetchCategories
        case updateAchievement(updateAchievementRequestValue: UpdateAchievementRequestValue)
    }
    
    enum CategoryState {
        case none
        case loading
        case finish
    }
    
    enum SaveImageState {
        case none
        case loading
        case finish
        case error
    }
    
    enum UpdateAchievementState {
        case none
        case loading
        case finish(updateAchievementRequestValue: UpdateAchievementRequestValue)
        case error
    }
    
    private let saveImageUseCase: SaveImageUseCase
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private let updateAchievementUseCase: UpdateAchievementUseCase
    private(set) var categories: [CategoryItem] = []
    var firstCategory: CategoryItem? {
        return categories.first
    }
    
    @Published private(set) var categoryState: CategoryState = .none
    @Published private(set) var saveImageState: SaveImageState = .none
    @Published private(set) var updateAchievementState: UpdateAchievementState = .none
    
    init(
        saveImageUseCase: SaveImageUseCase,
        fetchCategoryListUseCase: FetchCategoryListUseCase,
        updateAchievementUseCase: UpdateAchievementUseCase
    ) {
        self.saveImageUseCase = saveImageUseCase
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
        self.updateAchievementUseCase = updateAchievementUseCase
    }

    func action(_ action: Action) {
        switch action {
        case .saveImage(let data):
            saveImageData(data)
        case .fetchCategories:
            fetchCategories()
        case .updateAchievement(let updateAchievementRequestValue):
            updateAchievement(updateAchievementRequestValue: updateAchievementRequestValue)
        }
    }
    
    func findCategory(at index: Int) -> CategoryItem {
        return categories[index]
    }
    
    func findCategoryIndex(_ item: CategoryItem) -> Int? {
        for (index, category) in categories.enumerated() where item.id == category.id {
            return index
        }
        return nil
    }
    
    private func fetchCategories() {
        Task {
            do {
                categoryState = .loading
                categories = try await fetchCategoryListUseCase.execute()
                if !categories.isEmpty {
                    // "전체" 카테고리 제거
                    categories.removeFirst()
                }
            } catch {
                categories = []
            }
            
            categoryState = .finish
        }
    }
    
    private func saveImageData(_ data: Data) {
        Logger.debug("Save Image: \(data.count / 1000)KB / \(Double(data.count) / 1000.0 / 1000.0)MB")
        
        Task {
            do {
                saveImageState = .loading
                
                let requestValue = SaveImageRequestValue(
                    boundary: UUID().uuidString,
                    contentType: "jpeg", // heic로 테스트 해봤지만 전송되는 파일 데이터가 jpeg라서 의미 없음을 확인함. 따라서 jpeg로 통일해서 전송
                    imageData: data
                )
                let (isSuccess, imageId) = try await saveImageUseCase.excute(requestValue: requestValue)
                Logger.debug("Upload: \(isSuccess) / id: \(imageId)")
                saveImageState = .finish
            } catch {
                saveImageState = .error
            }
        }
        
    }
    
    private func updateAchievement(updateAchievementRequestValue: UpdateAchievementRequestValue) {
        Task {
            do {
                updateAchievementState = .loading
                let isSuccess = try await updateAchievementUseCase.execute(requestValue: updateAchievementRequestValue)
                if isSuccess {
                    updateAchievementState = .finish(updateAchievementRequestValue: updateAchievementRequestValue)
                } else {
                    updateAchievementState = .error
                }
            } catch {
                saveImageState = .error
            }
        }
        
    }
}
