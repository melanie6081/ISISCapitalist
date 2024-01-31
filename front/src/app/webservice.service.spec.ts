import { Injectable } from '@angular/core';

import { WebserviceService } from './webservice.service';
import { TestBed } from '@angular/core/testing';

describe('WebserviceService', () => {
  let service: WebserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
