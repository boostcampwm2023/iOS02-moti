// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Presentation",
    platforms: [.iOS(.v15)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "Launch",
            targets: ["Launch"]),
        .library(
            name: "AutoLayout",
            targets: ["AutoLayout"]),
        .library(
            name: "Common",
            targets: ["Common"])
    ],
    dependencies: [
        .package(path: "../Design")
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "Launch",
            dependencies: [
                .product(name: "Design", package: "Design"),
//                .product(name: "Common", package: "Presentation"),
            ]
        ),
        .target(
            name: "AutoLayout"
        ),
        .target(
            name: "Common"
        ),
        .testTarget(
            name: "PresentationTests",
            dependencies: ["Launch"])
    ]
)
