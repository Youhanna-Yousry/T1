package com.church.elre7la.controller;

import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/servant")
public class ServantTestController {

  @GetMapping("/test")
  public ResponseEntity<@NonNull String> getServantInfo() {
    return ResponseEntity.ok("Hey Servant!");
  }
}
