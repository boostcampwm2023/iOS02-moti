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
        case saveImage(data: Data, imageExtension: ImageExtension)
        case fetchCategories
    }
    
    enum CategoryState {
        case none
        case loading
        case finish
    }
    
    enum SaveImageState {
        case loading
        case finish
        case error
    }
    
    private let saveImageUseCase: SaveImageUseCase
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private(set) var categories: [CategoryItem] = []
    var firstCategory: CategoryItem? {
        return categories.first
    }
    
    @Published private(set) var categoryState: CategoryState = .none
    @Published private(set) var saveImageState: SaveImageState = .loading
    
    init(
        saveImageUseCase: SaveImageUseCase,
        fetchCategoryListUseCase: FetchCategoryListUseCase
    ) {
        self.saveImageUseCase = saveImageUseCase
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
    }

    func action(_ action: Action) {
        switch action {
        case .saveImage(let data, let imageExtension):
            saveImageData(data, imageExtension)
        case .fetchCategories:
            fetchCategories()
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
    
    private func saveImageData(_ data: Data, _ imageExtension: ImageExtension) {
        Logger.debug("Save Image: \(data.count)")
        
        Task {
            do {
                saveImageState = .loading
                
                let requestValue = SaveImageRequestValue(
                    boundary: UUID().uuidString,
                    contentType: "image/\(imageExtension.rawValue)",
                    imageData: data
                )
                let (isSuccess, imageId) = try await saveImageUseCase.excute(requestValue: requestValue)
                
                saveImageState = .finish
            } catch {
                saveImageState = .error
            }
        }
        
    }
}
