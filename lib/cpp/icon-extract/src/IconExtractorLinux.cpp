#include "IconExtractorLinux.h"
#include <fstream>

const char s_Placeholder[] =
    "\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00"
    "\x00\x20\x00\x00\x00\x20\x08\x02\x00\x00\x00\xfc\x18\xed\xa3\x00\x00\x00"
    "\x09\x70\x48\x59\x73\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18"
    "\x00\x00\x00\x07\x74\x49\x4d\x45\x07\xe0\x0a\x1f\x0a\x15\x38\x8a\x7a\x35"
    "\x16\x00\x00\x00\x1d\x69\x54\x58\x74\x43\x6f\x6d\x6d\x65\x6e\x74\x00\x00"
    "\x00\x00\x00\x43\x72\x65\x61\x74\x65\x64\x20\x77\x69\x74\x68\x20\x47\x49"
    "\x4d\x50\x64\x2e\x65\x07\x00\x00\x01\x60\x49\x44\x41\x54\x48\xc7\xed\x96"
    "\xc1\x8a\xc2\x30\x10\x86\x93\xdd\xdc\xc4\x7b\xc1\x83\x87\x3e\x81\x87\x3e"
    "\x8d\xcf\xd7\x07\x29\x48\x8b\xb4\xf6\x60\x41\x11\x2c\x55\xda\x81\x36\x22"
    "\x24\xc4\x36\x22\xa5\xdd\x83\x8b\x14\x65\x35\x75\x95\xdd\x65\xfd\x4f\x61"
    "\x08\xf3\xcd\x64\x92\x99\x60\xd7\x75\xd1\x33\xf5\x86\x9e\xac\x17\xe0\x1f"
    "\x00\xc8\x69\x65\x9a\xe6\x03\xfd\x0e\x87\xc3\x73\x40\xd3\xfa\x4d\x35\x63"
    "\xfd\x89\x1a\x10\x42\xc2\x30\x24\x84\x3c\x0b\xe0\xba\x2e\xa5\x54\xb1\x85"
    "\xd8\xb6\x9d\xe7\xb9\x52\x91\x4f\x1a\x0c\x06\x69\x9a\x6a\x9a\x76\xd3\xfb"
    "\x64\x32\x89\xe3\xb8\xdf\xef\x77\x3a\x9d\x76\xd7\x54\xc5\xbb\xef\xfb\x00"
    "\x50\x96\xe5\x6a\xb5\xba\xff\x1d\x00\xc0\xa5\x31\xcf\x73\xcb\xb2\xe6\xf3"
    "\xb9\x10\x02\x21\x54\x14\xc5\x95\x53\xba\x01\xf0\x3c\x6f\x3a\x9d\x9e\x21"
    "\x3d\xcf\x4b\x92\xe4\x64\x91\x52\x32\xc6\xee\x01\x8c\xc7\xe3\xdd\x6e\x17"
    "\xc7\xb1\x65\x59\xc7\x18\x01\x20\x8a\xa2\xa6\x77\x84\x90\x10\x62\x36\x9b"
    "\xb5\x28\xf2\x51\x41\x10\x2c\x97\x4b\x84\x10\x63\x8c\x31\x76\x38\x1c\x34"
    "\x4d\xe3\x9c\xaf\xd7\xeb\xcb\xcd\x18\x63\x00\xe8\xf5\x7a\xaa\x00\x00\xc8"
    "\xb2\xac\x69\xa1\x94\x52\x4a\xbf\x8a\xa6\x28\x8a\xfd\x7e\xaf\x9a\x81\xe3"
    "\x38\xdb\xed\x96\x73\xae\xfe\x9a\x84\x10\x8b\xc5\x42\xd7\x75\xa5\x1a\x48"
    "\x29\x39\xe7\xef\x6d\x44\x08\x61\x8c\x8d\x46\x23\xa5\x0c\xba\xdd\xee\x66"
    "\xb3\x39\x6b\x15\x55\x55\x5d\xc9\xa0\xae\x6b\x8c\xb1\x94\x52\x09\x60\x18"
    "\x86\x61\x18\x7f\x70\xe0\x3c\x7c\xe6\x7c\xde\xe0\xd7\xc7\xeb\x05\xf8\xfd"
    "\x80\x0f\x83\xa3\xbd\x4b\xb4\xe0\xbf\x05\x00\x00\x00\x00\x49\x45\x4e\x44"
    "\xae\x42\x60\x82";

bool IconExtractorLinux::extractIconToPngFile(const std::string &executable,
                                              const std::string &output,
                                              int width,
                                              const std::string &format) {
  // TODO on linux executables have no associated icon, but they usually have a
  //   meta file /usr/share/applications/<appname>.desktop that contains an icon
  //   name which can then be found at
  //   /usr/share/icons/[hi,lo]color/<widthxheight>/appname.png
  //   TBH this lookup would probably be easier to do in JS as linux doesn't use
  //   a custom icon format.
  std::ofstream file(output, std::fstream::out | std::fstream::binary);
  file.write(s_Placeholder, sizeof(s_Placeholder));
  file.close();
  return true;
}
