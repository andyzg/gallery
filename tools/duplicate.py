import os
import shutil

PHOTO_PATH = './photos/'


def is_image_path(path):
    return path.endswith('jpg') or \
           path.endswith('jpeg') or \
           path.endswith('png')


def to_min_path(path):
    # Oh god this code sucks, plz fix
    if path.endswith('jpg'):
        return path.replace('.jpg', '.min.jpg')
    if path.endswith('jpeg'):
        return path.replace('.jpeg', '.min.jpeg')
    if path.endswith('png'):
        return path.replace('.png', '.min.png')

for folder in os.listdir(PHOTO_PATH):
    # Ignore other files like .DS_Store
    if not os.path.isdir(PHOTO_PATH + folder):
        continue

    for f in os.listdir(PHOTO_PATH + folder):
        path = PHOTO_PATH + folder + '/' + f
        if is_image_path(path) and '.min.' not in path:
            min_path = to_min_path(path)
            shutil.copy(path, min_path)
