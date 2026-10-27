rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isOwner() {
      return request.auth != null
          && request.auth.token.email == 'ضعي-إيميل-المالكة-هنا@gmail.com';
    }

    match /products/{id} {
      allow read: if true;
      allow write: if isOwner();
      match /colors/{colorId} {
        allow read: if true;
        allow write: if isOwner();
      }
    }

    match /reviews/{id} {
      allow read: if true;
      allow write: if isOwner();
    }

    match /community/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['id','sender','text','isOwner','replies'])
                    && request.resource.data.sender is string
                    && request.resource.data.sender.size() <= 60
                    && request.resource.data.text is string
                    && request.resource.data.text.size() <= 1000
                    && request.resource.data.isOwner is bool
                    && (request.resource.data.isOwner == false || isOwner());
      allow update: if isOwner()
                    || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['replies']);
      allow delete: if isOwner();
    }
  }
}
