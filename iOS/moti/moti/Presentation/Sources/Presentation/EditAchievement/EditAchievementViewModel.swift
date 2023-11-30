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
        case postAchievement(title: String, content: String, categoryId: Int)
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
    
    enum PostAchievementState {
        case none
        case loading
        case finish(newAchievement: Achievement)
        case error(message: String)
    }
    
    private let saveImageUseCase: SaveImageUseCase
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private let updateAchievementUseCase: UpdateAchievementUseCase
    private let postAchievementUseCase: PostAchievementUseCase
    private(set) var categories: [CategoryItem] = []
    var firstCategory: CategoryItem? {
        return categories.first
    }
    private var photoId: Int?
    
    @Published private(set) var categoryState: CategoryState = .none
    @Published private(set) var saveImageState: SaveImageState = .none
    @Published private(set) var updateAchievementState: UpdateAchievementState = .none
    @Published private(set) var postAchievementState: PostAchievementState = .none
    
    init(
        saveImageUseCase: SaveImageUseCase,
        fetchCategoryListUseCase: FetchCategoryListUseCase,
        updateAchievementUseCase: UpdateAchievementUseCase,
        postAchievementUseCase: PostAchievementUseCase
    ) {
        self.saveImageUseCase = saveImageUseCase
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
        self.updateAchievementUseCase = updateAchievementUseCase
        self.postAchievementUseCase = postAchievementUseCase
    }

    func action(_ action: Action) {
        switch action {
        case .saveImage(let data):
            saveImageData(data)
        case .fetchCategories:
            fetchCategories()
        case .updateAchievement(let updateAchievementRequestValue):
            updateAchievement(updateAchievementRequestValue: updateAchievementRequestValue)
        case .postAchievement(let title, let content, let categoryId):
            postAchievement(title: title, content: content, categoryId: categoryId)
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
                let (isSuccess, photoId) = try await saveImageUseCase.execute(requestValue: requestValue)
                Logger.debug("Upload: \(isSuccess) / id: \(photoId)")
                self.photoId = photoId
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
                updateAchievementState = .error
            }
        }
    }
    
    private func postAchievement(title: String, content: String, categoryId: Int) {
        Task {
            do {
                guard let photoId else {
                    postAchievementState = .error(message: "post achievement error: not exist photoId")
                    return
                }
                let requestValue = PostAchievementRequestValue(
                    title: title,
                    content: content,
                    categoryId: categoryId,
                    photoId: photoId
                )
                
                postAchievementState = .loading
                let newAchievement = try await postAchievementUseCase.execute(requestValue: requestValue)
                postAchievementState = .finish(newAchievement: newAchievement)
            } catch {
                postAchievementState = .error(message: "post achievement error")
            }
        }
    }
}
