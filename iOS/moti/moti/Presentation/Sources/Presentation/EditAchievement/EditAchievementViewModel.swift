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
        case retrySaveImage
        case fetchCategories
        case updateAchievement(updatedAchievement: Achievement)
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
        case finish(updatedAchievement: Achievement)
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
    
    /// 이미지 선저장으로 받아 놓은 사진 ID: post할 때 이 ID를 포함하여 post한다.
    private var photoId: Int?
    private var uploadImageData: Data?
    
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
        case .retrySaveImage:
            guard let uploadImageData else { return }
            saveImageData(uploadImageData)
        case .fetchCategories:
            fetchCategories()
        case .updateAchievement(let updatedAchievement):
            updateAchievement(updatedAchievement: updatedAchievement)
        case .postAchievement(let title, let content, let categoryId):
            postAchievement(title: title, content: content, categoryId: categoryId)
        }
    }
    
    func findCategory(at index: Int) -> CategoryItem? {
        guard index < categories.count else { return nil }
        return categories[index]
    }
    
    func findCategoryItem(categoryId: Int) -> (Int, CategoryItem)? {
        for (index, category) in categories.enumerated() where category.id == categoryId {
            return (index, category)
        }
        return nil
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
                    .filter { $0.id != 0 } // "전체" 카테고리 제거
            } catch {
                categories = []
            }
            
            categoryState = .finish
        }
    }
    
    private func saveImageData(_ data: Data) {
        Logger.debug("Save Image: \(data.count / 1000)KB / \(Double(data.count) / 1000.0 / 1000.0)MB")
        uploadImageData = data
        
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
                uploadImageData = nil // 더이상 필요 없어서 nil 할당
                
                saveImageState = .finish
            } catch {
                saveImageState = .error
            }
        }
        
    }
    
    private func updateAchievement(updatedAchievement: Achievement) {
        Task {
            do {
                updateAchievementState = .loading
                let updatedData = UpdateAchievementRequestBody(
                    title: updatedAchievement.title,
                    content: updatedAchievement.body ?? "",
                    categoryId: updatedAchievement.categoryId
                )
                
                let updateAchievementRequestValue = UpdateAchievementRequestValue(
                    id: updatedAchievement.id,
                    body: updatedData
                )
                
                let isSuccess = try await updateAchievementUseCase.execute(requestValue: updateAchievementRequestValue)
                if isSuccess {
                    updateAchievementState = .finish(updatedAchievement: updatedAchievement)
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
