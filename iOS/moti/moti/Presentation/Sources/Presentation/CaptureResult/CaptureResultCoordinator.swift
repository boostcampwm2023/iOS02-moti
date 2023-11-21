////
////  CaptureResultCoordinator.swift
////  
////
////  Created by 유정주 on 11/20/23.
////
//
//import UIKit
//import Core
//
//final class CaptureResultCoordinator: Coordinator {
//    var parentCoordinator: Coordinator?
//    var childCoordinators: [Coordinator] = []
//    var navigationController: UINavigationController
//    
//    init(
//        _ navigationController: UINavigationController,
//        _ parentCoordinator: Coordinator?
//    ) {
//        self.navigationController = navigationController
//        self.parentCoordinator = parentCoordinator
//    }
//    
//    func start() {
//        
//    }
//    
//    func start(resultImageData: Data) {
//        let captureResultVC = CaptureResultViewController(resultImageData: resultImageData)
//        captureResultVC.coordinator = self
//        
//        captureResultVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
//            title: "다시 촬영", style: .plain, target: self,
//            action: #selector(recaptureButtonAction)
//        )
//        
//        captureResultVC.navigationItem.rightBarButtonItem = UIBarButtonItem(
//            barButtonSystemItem: .done,
//            target: self,
//            action: #selector(doneButtonAction)
//        )
//        
//        navigationController.pushViewController(captureResultVC, animated: false)
//    }
//    
//    @objc func recaptureButtonAction() {
//        finish(animated: false)
//    }
//    
//    @objc func doneButtonAction() {
//        finish(animated: false)
//        parentCoordinator?.finish(animated: true)
//    }
//}
