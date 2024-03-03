//
//  LoginRequester.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import Foundation

// 추후 다른 소셜 로그인이 추가될 수 있으니 추상화함
protocol LoginRequester {

    func request()
}
