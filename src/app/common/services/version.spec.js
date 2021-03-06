describe("app.service.version (unit testing)", function() {
  "use strict";

  /*****************************************************************************
   * Global Variables
   ****************************************************************************/

  var versionService,
      $rootScope,
      $httpBackend,
      changelogFakeData = [
          {
            version: "0.0.0",
            type: "fix",
            msg: "test"
          },
          {
            version: "0.0.0",
            type: "update",
            msg: "test"
          }
        ],
      versionsFakeData = [
          {
            version: "0.0.0",
            release: "2000-01-01",
            msg: "test"
          }
        ];


  /*****************************************************************************
   * Global Setting / Setup
   ****************************************************************************/

  beforeEach(function() {
    module('sbb');

    inject(function ($injector) {
      versionService = $injector.get('versionService');

      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
    });
  });


  /*****************************************************************************
   * General / Existance Testing
   ****************************************************************************/

  it('should contain the versionService',
    function () {
      expect(versionService).not.toEqual(null);
    }
  );

  it('exists the `getChangelog` function',
    function () {
      expect(typeof(versionService.getChangelog)).toEqual('function');
    }
  );

  it('exists the `getVersions` function',
    function () {
      expect(typeof(versionService.getVersions)).toEqual('function');
    }
  );


  /*****************************************************************************
   * Functional Testing
   ****************************************************************************/

  it('should resolve promises',
    function () {
      var changelog,
          versions,
          transformedChangelog = {
            "0.0.0": changelogFakeData
          };

      $httpBackend
        .expectGET('http://sbb.cellfinder.org/api/1.2.3/changelog')
        .respond(changelogFakeData);

      $httpBackend
        .expectGET('http://sbb.cellfinder.org/api/1.2.3/versions')
        .respond(versionsFakeData);

      versionService.getChangelog().then(function(data){
        changelog = data;
      });

      versionService.getVersions().then(function(data){
        versions = data;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(changelog).toEqual(transformedChangelog);
      expect(versions).toEqual(versionsFakeData);
    }
  );

  it('should reject errors',
    function () {
      var changelogErr,
          versionErr;

      $httpBackend
        .expectGET('http://sbb.cellfinder.org/api/1.2.3/changelog')
        .respond(500, 'error');

      $httpBackend
        .expectGET('http://sbb.cellfinder.org/api/1.2.3/versions')
        .respond(500, 'error');

      versionService
        .getChangelog()
        .catch(function (e) {
          changelogErr = e;
        });

      versionService
        .getVersions()
        .catch(function (e) {
          versionErr = e;
        });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(changelogErr).toEqual('error');
      expect(versionErr).toEqual('error');
    }
  );

});
