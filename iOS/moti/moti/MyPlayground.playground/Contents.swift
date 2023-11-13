import UIKit

struct A {
    let a: Int
    let b: Int
}

struct B {
    let a: Int?
    let b: Int?
}

extension A {
    init(dto: B) {
        self.a = dto.a ?? 0
        self.b = dto.b ?? 0
    }
}
