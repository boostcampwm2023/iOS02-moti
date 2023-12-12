# iOS02 - moti
<p align="center"><img src="https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/779bef03-5b82-458f-9fd1-12d43eeece57" width="150" height="150"/></p>

<div align="center">
도전을 사진으로 기록하는 앱 <br>
애플다운 자연스러운 사용성도 느낄 수 있습니다. <br><br>
<a href="https://github.com/orgs/boostcampwm2023/projects/109">깃허브 프로젝트</a>
    |
<a href="https://github.com/boostcampwm2023/iOS02-moti/wiki">깃허브 위키</a>

</div>

</br>

# 스크린샷
![모티메이트-표지](https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/8c43710a-6a83-4bbf-b34e-27806c5b9158)

<div align="center">
<img src = "https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/7bd61fcf-f7af-45f9-b205-77ecbd2b37af" width = "24.5%">
<img src = "https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/27334baf-b7d6-435d-99ee-609fd69663d3" width = "24.5%">
<img src = "https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/4cb09f36-9036-405c-a479-3e184d98e712" width = "24.5%">
<img src = "https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/da25b862-f093-4101-b341-81f6354e3f6b" width = "24.5%">
</div>

</br>


# 기술적 고민
## iOS

<details>
<summary>Interaction Animation</summary>
<div markdown="1">      

### Interaction Animation

제목
- 사용자에게 긍정적인 사용성을 주기 위해 고민

배경

- 디테일한 애니메이션은 우리가 iOS 앱에 매력을 느끼는 이유 중 하나
- iOS 앱의 가장 큰 장점인 자연스럽고 부드러운 사용성 적용
- 토스 디자이너의 “인터랙션, 꼭 넣어야 해요?” 발표를 듣고 Interaction의 관심도 증가

결정

- 상용 앱에서 인상 깊었던 Interaction Animation을 moti 앱에도 적용
- 적절한 진동도 함께 적용

결과 및 영향

- 사용자가 앱과 인터랙션하고 있음을 손가락으로 느낄 수 있음
- 자연스럽고 부드러운 사용성 제공

</div>
</details>

<details>
<summary>이미지 메모리 최적화</summary>
<div markdown="1">      

### 이미지 메모리 최적화

제목

- 이미지에 사용되는 메모리를 최적화

배경

- WWDC18 - iOS Memory Deep Dive에서 메모리 최적화의 이유를 소개
    - 사용자가 더 나은 경험을 할 수 있음
    - 앱 실행 속도가 빨라지고, 더 오래 유지될 수 있음
- WWDC18 - Image and Graphics Best Practices에서 이미지를 메모리에 할당하는 원리를 학습함
    - width * height * 4byte(r, g, b, a)
- 위 내용을 종합하여 사진을 많이 쓰는 moti 앱은 메모리 최적화가 반드시 필요함

결정

- 1단계로 다운샘플링을 하여 frame buffer에 낭비되는 메모리를 줄임
- 2단계로 다운샘플링 데이터를 메모리 캐시에 저장하여 원본 이미지를 저장할 때보다 최적화함
    - 썸네일 이미지는 다운샘플링 데이터를 메모리 캐시, 디스크 캐시에 저장
    - 원본 이미지는 디스크 캐시에만 저장

결과 및 영향

- 원본 이미지를 표시했을 때는 900MB ~ 1GB를 소비함
- 1단계 메모리 최적화(다운샘플링)를 진행한 결과, 120~130MB로 줄어들음 - 8배 감소
- 2단계 메모리 최적화(메모리 캐시 개선)를 진행한 결과, 90~100MB로 줄어들음

</div>
</details>

<details>
<summary>보이스 오버</summary>
<div markdown="1">      

### 보이스 오버

제목

- 달성 기록 사진에 보이스오버 적용

배경

- 부스트캠프의 접근성 특강을 듣고 시각장애인이 앱을 사용했을 때 어떤 불편함이 있을지 고민함
    - 사진을 다루는 앱이므로 사진을 읽을 수 없겠다고 생각함

결정

- 달성기록 사진에 보이스오버를 적용하여 시각장애인도 기록을 들을 수 있도록 결정

결과 및 영향

- 소리만으로 moti 앱의 기능을 파악할 수 있음

</div>
</details>


<details>
<summary>클린 아키텍처</summary>
<div markdown="1">

### Clean Architecture

제목
- moti 앱에 사용할 아키텍처 고민

이유
- 객체의 역할과 관심사의 분리 필요성을 느낌

결정
- 클린 아키텍처 + MVVM 적용
    - Domain, Data, Presentation으로 레이어를 분리해서 객체의 역할과 관심사를 분리함
    - Massive ViewController을 없애기 위해 비즈니스 로직을 ViewModel로 분리
    - ViewController의 View를 분리하여 레이아웃 코드 분리

결과 및 영향
- 역할이 분리되서 재사용과 테스트에 용이함
- 코드가 어떤 역할을 하는지 파악하기 쉬워짐

계속 고민할 점
- 각 객체의 역할이 적절히 분리되어 있는지
- 각 객체의 역할 만을 충실히 수행하고 있는지

</div>
</details>

<details>
<summary>Swift Package 모듈화</summary>
<div markdown="1">
    
### Swift Package로 모듈화 적용

제목
- 모듈화 적용 고민

배경
- 레이어를 폴더로 분리하는 것보다 엄격한 분리를 원함

결정
- Swift Package로 모듈화 결정
    - tuist같은 서드파티 라이브러리보다 공식 지원 방법을 먼저 익히기 위함
    - 일부러 불편함을 겪으며 아키텍처와 모듈화의 이해도 증가를 기대함

결과 및 영향
- 컴파일 단계에서 레이어 침범을 확인할 수 있음
    - 다른 레이어의 코드는 import를 하지 않으면 쓸 수 없음
- 빌드 시간의 감소
    - 변경이 발생한 패키지만 새로 빌드됨
    - 작은 프로젝트 크기지만 체감될 정도로 빌드 시간이 감소되었음
- 악영향
    - Swift Package 안에서 #Preview 사용 불가  
      <img width="512" src="https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/a9b66d12-de61-478d-ba08-67743409cb9f">
    - #Preview는 매번 컴파일을 하는 원리라서 Swift Package에서는 사용이 불가했음
    - 기대했던 기능이라 아쉬웠고, 기술 간의 상성도 존재한다는 것을 배웠음

</div>
</details>

## BE
<details>
<summary>아키텍처</summary>
<div markdown="1">      

### 아키텍처
<img width="512" src="https://github.com/boostcampwm2023/iOS02-moti/assets/89075274/4d52fa16-a390-488d-b2a4-1b8346a64b8d">


- NestJS, TypeScript, Jest, Typeorm
- MySQL, Redis
- Nginx, Grafana, Prometheus
- Git Action
- Docker

</div>
</details>

<details>
<summary>서버리스</summary>
<div markdown="1">      
    
### 서버리스

- 선택 배경
    - 썸네일 생성하는 컴퓨팅 리소스 비용이 꽤 크다.
    - 썸네일 생성하는 서버를 따로 분리해서 띄우자니 서버 비용 문제 이슈가 있었다.
- 사용 목적
    - 썸네일 생성하는 컴퓨팅 리소스 비용을 애플리케이션 서버가 부담한다.
    - 썸네일 생성작업은 이미지가 업로드 되었을 때만 실행되는 작업이다.
- 장단점
    - 단점
        - 서버리스의 경우 오랜시간동안 실행이되지 않으면 Cold Start로 지연 실행이되는데 이는 즉각적으로 응답해야 하는 서비스에서 서버리스를 사용하는 것은 Cold Start 문제가 부담이 된다.
    - 장점
        - 비용 절감
        - 로직에서 썸네일을 만드는건 사용자의 요청흐름과 다르게 독자적인 흐름이다. 즉 썸네일이 저장될때까지 사용자가 기다리지 않아도 된다.
          
</div>
</details>


<details>
<summary>테스트 코드</summary>
<div markdown="1">
    
### 테스트 코드
- coverage - 96%
- 총 테스트 케이스 550여개
- Repository layer 테스트
    - DB 연동하여 실제 쿼리 실행 결과에 대한 테스트
- Service layer 테스트
    - 테스트 더블 없이 DB 연동하여 비즈니스 로직 테스트 - classicist 방식 채택
- Controller layer 테스트
    - supertest + ts-mock을 이용한 테스트
    - 실제 http 요청처리
    - 이미 검증된 service layer는 테스트 더블을 사용
- 테스트용 DB
    - mysql 사용한다.
    - SQL3ite의 경우 mysql dialect를 지원하지 않기 때문에 네이티브쿼리로 동작하는 동작에 대한 테스트를 완벽하게 지원하지 못할 수 있다.
- 테스트 케이스간 격리를 위해서 트랜잭션 및 데이터 롤백 적용
  
</div>
</details>


<details>
<summary>CI & CD</summary>
<div markdown="1">      

### CI & CD
- Git Action을 이용한 CI & CD
- 테스트 오류 시 merge block
- PR merge 시 ncp 인스턴스에 자동 배포

</div>
</details>

</br>

# 기술 스택
### iOS
```Swift``` ```UIKit``` ```Code Based UI``` ```SPM``` ```MVVM``` ```Clean Architecture``` ```SwiftLint```
### BE
```TypeScript``` ```NestJS``` ```Jest``` ```MySQL``` ```Redis``` ```Docker```

</br>


# 팀원 소개
<div align="center">
<table>
    <thead>
        <tr >
            <th style="text-align:center;" >iOS</th>
            <th style="text-align:center;" >iOS</th>
            <th style="text-align:center;" >BE</th>
            <th style="text-align:center;" >BE</th>
        </tr>
    </thead>
    <tbody align=center>
        <tr>
            <td><a href="https://github.com/jeongju9216"><img width="150" src="https://github.com/jeongju9216.png" /></a></td>
            <td><a href="https://github.com/looloolalaa"><img width="150" src="https://github.com/looloolalaa.png" /></a></td>
            <td><a href="https://github.com/lsh23"><img width="150" src="https://github.com/lsh23.png" /></a></td>
            <td><a href="https://github.com/Dltmd202"><img width="150" src="https://github.com/Dltmd202.png" /></a></td>
        </tr>
        <tr>
            <td>S022_유정주</td>
            <td>S025_이기현</td>
            <td>J102_이세형</td>
            <td>J107_이승환</td>
        </tr>
        <tr>
            <td><a href="dbwjdwn9216@gmail.com">dbwjdwn9216@gmail.com</a></td>
            <td><a href="dlrlgus65@nate.com">dlrlgus65@nate.com</a></td>
            <td><a href="shseoul14@gmail.com">shseoul14@gmail.com</a></td>
            <td><a href="dltmd202@gmail.com">dltmd202@gmail.com</a></td>
        </tr>
    </tbody>
</table>
</div align="center">

</br>
