angular.module('starter.services', [])

  .factory('Camera', ['$q', function($q) {
    return {
      getPicture: function(options) {
        var q = $q.defer();
        console.log("navigator camera getPicture");
        navigator.camera.getPicture(function(result) {
          console.log("getPicture success");
          q.resolve(result);
        }, function(err) {
          console.log("getPicture failure");
          q.reject(err);
        }, options);

        return q.promise;
      }
    }
  }])

  .factory('Projects', ['$q', function($q) {
    var projDB;
    var setUp = false;
    initDB = function() {

      var deferq = $q.defer();
      if (setUp) {
        deferq.resolve(true);
        return deferq.promise;
      }

      var openReq = window.indexedDB.open("projects");
      openReq.onupgradeneeded = function(event) {
        var db = event.target.result;
        var store = db.createObjectStore("project", {autoIncrement: true});
        var titleIndex = store.createIndex("by_title", "title", {unique: true});

      }
      openReq.onsuccess = function(event) {
        projDB = event.target.result;
        projDB.error = function(event) {
          deferq.reject("database error: " + event.target.errorCode);
        };
        setup = true;
        deferq.resolve(true);
      }
      openReq.onerror = function(event) {
        console.err("project database error: " + event.target.errorCode);
        deferq.reject(event.toString());
      }
      return deferq.promise;
    };

    return  {
      all: function() {
        var projectString = window.localStorage['projects'];
        if (projectString) {
          return angular.fromJson(projectString);
        }
        return [];
      },
      openReqAll: function() {
        var q = $q.defer();
        initDB().then(function() {
          var projects = [];
          var iProject = projDB.transaction("project", "readonly");
          var store = iProject.objectStore("project");
          var index = store.index("by_title");
          var request = store.openCursor();
          request.onsuccess = function() {
            var cursor = request.result;
            if (cursor) {
              //report(cursor.value.title);
              //projects.push(angular.fromJson(cursor.value));
              projects.push(cursor.value);
              cursor.continue();
            } else {
              // report(null);
            }
          }
          iProject.oncomplete = function(event) {
            q.resolve(projects);
          }
        })
        return q.promise;
      },
      save: function(projects) {
        console.log('save project: ', projects);
        window.localStorage['projects'] = angular.toJson(projects); // localstorage file
      },
      openReqSave: function(project) {
        var iProject = projDB.transaction("project", "readwrite");
        var store = iProject.objectStore("project");
        //store.put(angular.toJson(project));
        store.put(project);
        iProject.oncomplete = function() {
          console.log("project saved");
        }
      },
      newProject: function(projectTitle) {
        return {
          title: projectTitle,
          tasks: []
        };
      },
      getLastActiveIndex: function() {
        return parseInt(window.localStorage['lastActiveProjects']) || 0;
      },
      setLastActiveIndex: function(index) {
        window.localStorage['lastActiveProject'] = index;
      }
    }
  }])
