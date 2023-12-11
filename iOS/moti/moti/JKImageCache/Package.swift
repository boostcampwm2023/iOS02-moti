// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "JKImageCache",
    platforms: [.iOS(.v15)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "JKImageCache",
            targets: ["JKImageCache"])
    ],
    dependencies: [
        .package(url: "https://github.com/jeongju9216/Jeongfisher.git", from: "2.5.0")
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "JKImageCache",
            dependencies: [
                "Jeongfisher"
            ],
            path: "Sources"),
        .testTarget(
            name: "JKImageCacheTests",
            dependencies: ["JKImageCache"])
    ]
)
