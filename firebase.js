rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isOwner() {
      return request.auth != null
        && request.auth.uid == 'QvzcJcAG9XUHaEJxOjGVbi3nTRL2';
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

      allow create: if
        request.resource.data.keys().hasOnly([
          'sender',
          'text',
          'isOwner',
          'replies',
          'createdAt'
        ])
        && request.resource.data.sender is string
        && request.resource.data.sender.size() > 0
        && request.resource.data.sender.size() <= 60
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 1000
        && request.resource.data.isOwner == false
        && request.resource.data.replies is list
        && request.resource.data.replies.size() == 0
        && request.resource.data.createdAt is timestamp;

      allow update, delete: if isOwner();
    }

    match /orders/{id} {

      // العميلة تستطيع إنشاء طلب فقط
      allow create: if
        request.resource.data.keys().hasOnly([
          'customerName',
          'customerPhone',
          'customerAddress',
          'items',
          'total',
          'deposit',
          'status',
          'createdAt'
        ])
        && request.resource.data.customerName is string
        && request.resource.data.customerName.size() > 0
        && request.resource.data.customerName.size() <= 100
        && request.resource.data.customerPhone is string
        && request.resource.data.customerPhone.size() > 0
        && request.resource.data.customerPhone.size() <= 30
        && request.resource.data.customerAddress is string
        && request.resource.data.customerAddress.size() > 0
        && request.resource.data.customerAddress.size() <= 500
        && request.resource.data.items is list
        && request.resource.data.items.size() > 0
        && request.resource.data.items.size() <= 20
        && request.resource.data.total is number
        && request.resource.data.total > 0
        && request.resource.data.deposit == 100
        && request.resource.data.status == 'pending'
        && request.resource.data.createdAt is timestamp;

      // قراءة الطلبات وتعديلها وحذفها للمالكة فقط
      allow read, update, delete: if isOwner();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
      
